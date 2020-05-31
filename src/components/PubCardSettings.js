import React from 'react';
import { Form, Tabs, Tab, Button } from 'react-bootstrap';

/**
 * return the settings for the publication card in profile page
 * @param {Object} props some state objects in parent page
 */
export const PubCardSettings = (props) => {
  let cardElements = props.cards.map((card, cardIndex) => {
    // provide a picture download link
    let imgDownloadLink = null;
    if (card.imgUrl !== "") {
      const url = process.env.REACT_APP_BACKEND_URL + "/getCardImgByUrl?"
        + "visitUrl=" + encodeURIComponent(card.imgUrl);

      imgDownloadLink = 
        <a 
          href={url} 
          style={{color: "gray", fontSize: "smaller"}} 
          download
        >
          [download picture]
        </a>;
    }

    // provide image upload functionality
    // if the card is not deprecated
    let imageUploadSection = 
      <div>
        <Form.Label>Image Upload Disabled</Form.Label>
      </div>;
    if (card.deprecated === 0) {
      imageUploadSection = 
        <div>
          <Form.Label>Upload The Cover Picture</Form.Label>
          <Form.File custom> 
            <Form.File.Input 
              isValid={card.isPicValid}
              isInvalid={!card.isPicValid} 
              onChange={props.handleCardPicChange(cardIndex, "pub")}
            />
            <Form.File.Label data-browse="Choose File">
              {card.imgName}
            </Form.File.Label>
            <Form.Control.Feedback type="valid">
              {card.picUploadMsg}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="invalid" style={{color: "red"}}>
              invalid picture type!
            </Form.Control.Feedback>
          </Form.File>
          {imgDownloadLink}
        </div>;
    }

    const cardTab = 
    <Tab key={cardIndex} eventKey={cardIndex} title={`Card ${cardIndex+1}`} size="sm">
      <Form.Group 
          key={cardIndex} 
          controlId={cardIndex} 
          style={{backgroundColor: "rgb(219, 215, 210)", padding: "15px"}}
      >
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control 
            name="title"
            value={card.title} 
            onChange={props.handleCardChange(cardIndex, "pub")}
            disabled={card.deprecated === 1}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Subtitle (usually to put authors)</Form.Label>
          <Form.Control 
            name="subtitle"
            value={card.subtitle} 
            onChange={props.handleCardChange(cardIndex, "pub")}
            disabled={card.deprecated === 1}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>external URL</Form.Label>
          <Form.Control 
            name="url"
            value={card.url} 
            onChange={props.handleCardChange(cardIndex, "pub")}
            disabled={card.deprecated === 1}
          />
        </Form.Group>

        <Form.Group>
          {imageUploadSection}
        </Form.Group>

        <Form.Group>
          <Form.Label>Card Text</Form.Label>
          <Form.Control
            style={{height: "90px"}} 
            name="text"
            as="textarea" 
            value={card.text} 
            onChange={props.handleCardChange(cardIndex, "pub")}
            disabled={card.deprecated === 1}
          />
        </Form.Group>

        <Form.Group>
          <Button 
            variant={card.deprecated === 1 ? "outline-danger" : "danger"}
            size="sm"
            onClick={props.handleRemove(cardIndex, "pub")}
          >
            {card.deprecated === 1 ? "Cancel" : "Remove"}
          </Button>
          <Button
            size="sm"
            name="pub"
            onClick={props.handleAddCard}
            style={{marginLeft: "8px"}}
          >
            Add another card
          </Button>
          <Form.Text style={{color: "red", marginLeft: "2px"}}>WARNING: the whole card will be removed after update!</Form.Text>
        </Form.Group>

      </Form.Group>
    </Tab>;

    return (cardTab);
  });

  return (
    <Tabs className="myClass">
      {cardElements}
    </Tabs>
  );
}