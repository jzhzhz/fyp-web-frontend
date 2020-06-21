import React from 'react';
import { Form, Tabs, Tab, Button, InputGroup } from 'react-bootstrap';

/**
 * return the settings for the home page card in home page
 * @param {Object} props some state objects in parent page
 */
export const HomeCardSettings = (props) => {
  const cardTabs = props.cards.map((card, cardIndex) => {
    let imgDownloadLink = null;
    if (card.imgUrl !== "") {
      const url = process.env.REACT_APP_BACKEND_URL + "/getCardImgByUrl?"
        + "visitUrl=" + encodeURIComponent(card.imgUrl);

      imgDownloadLink =
        <a
          href={url}
          style={{ color: "gray", fontSize: "smaller" }}
          download
        >
          [download picture]
        </a>;
    }

    let imageUploadSection =
      <div className="img-upload-section">
        <Form.Label>Image Upload Disabled</Form.Label>
      </div>;
    if (card.deprecated === 0) {
      imageUploadSection =
        <div className="img-upload-section">
          <Form.Label>Upload The Cover Picture</Form.Label>
          <Form.File
            id="custom-file"
            custom
          >
            <Form.File.Input
              isValid={card.isPicValid}
              isInvalid={!card.isPicValid}
              onChange={props.handlePicChange(cardIndex)}
            />
            <Form.File.Label data-browse="Choose File">
              {card.imgName}
            </Form.File.Label>
            <Form.Control.Feedback type="valid">
              {card.uploadMsg}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
              invalid picture type!
            </Form.Control.Feedback>
          </Form.File>
          {imgDownloadLink}
        </div>;
    }

    return (
      <Tab
        className="card-tab"
        key={cardIndex}
        eventKey={cardIndex}
        title={`Card ${cardIndex + 1}`}
        size="sm"
      >
        <Form.Group
          key={cardIndex}
          controlId={cardIndex}
          style={{ backgroundColor: "rgb(219, 215, 210)", padding: "15px" }}
        >
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={card.title}
              onChange={props.handleCardChange(cardIndex)}
              disabled={card.deprecated === 1}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>URL</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>https://site-address</InputGroup.Text>
              </InputGroup.Prepend>

              <Form.Control
                name="url"
                value={card.url}
                onChange={props.handleCardChange(cardIndex)}
                disabled={card.deprecated === 1}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            {imageUploadSection}
          </Form.Group>

          <Form.Group>
            <Form.Label>Date Footer</Form.Label>
            <Form.Control
              name="date"
              value={card.date}
              onChange={props.handleCardChange(cardIndex)}
              disabled={card.deprecated === 1}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Card Text</Form.Label>
            <Form.Control
              name="text"
              as="textarea"
              value={card.text}
              onChange={props.handleCardChange(cardIndex)}
              disabled={card.deprecated === 1}
              style={{ height: "90px" }}
            />
          </Form.Group>

          <Form.Group>
            <Button
              variant={card.deprecated === 1 ? "outline-danger" : "danger"}
              size="sm"
              onClick={props.handleCardRemove(cardIndex)}
            >
              {card.deprecated === 1 ? "Cancel" : "Remove"}
            </Button>
            <Button
              size="sm"
              name="news"
              onClick={props.handleAddCard}
              style={{ marginLeft: "8px" }}
            >
              Add another card
            </Button>
            <Form.Text style={{ color: "red", marginLeft: "2px" }}>
              WARNING: the whole card will be removed after update!
            </Form.Text>
          </Form.Group>

        </Form.Group>
      </Tab>
    );
  })

  return (
    <Tabs className="card-tabs" defaultActiveKey={0}>
      {cardTabs}
    </Tabs>
  );
}