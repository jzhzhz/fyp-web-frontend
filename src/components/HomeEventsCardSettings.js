import React from 'react';
import { Form, Tabs, Tab, Button } from 'react-bootstrap';

/**
 * return the settings for the events card in home page
 * @param {Object} props some state objects in parent page
 */
export const HomeEventsCardSettings = (props) => {
  const cardTabs = props.cards.map((card, cardIndex) => {
    return (
      <Tab className="card-tab" key={cardIndex} eventKey={cardIndex} title={`Card ${cardIndex+1}`} size="sm">
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
              onChange={props.handleEventsCardChange(cardIndex)}
              disabled={card.deprecated === 1}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Subtitle</Form.Label>
            <Form.Control 
              name="subtitle"
              value={card.subtitle} 
              onChange={props.handleEventsCardChange(cardIndex)}
              disabled={card.deprecated === 1}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Event Content</Form.Label>
            <Form.Control 
              name="content"
              as="textarea"
              value={card.content}
              onChange={props.handleEventsCardChange(cardIndex)}
              disabled={card.deprecated === 1}
              style={{height: "110px"}}
            />
          </Form.Group>

          <Form.Group>
            <Button 
              variant={card.deprecated === 1 ? "outline-danger" : "danger"}
              size="sm"
              onClick={props.handleEventsCardRemove(cardIndex)}
            >
              {card.deprecated === 1 ? "Cancel" : "Remove"}
            </Button>
            <Button
              size="sm"
              name="news"
              onClick={props.handleAddEventsCard}
              style={{marginLeft: "8px"}}
            >
              Add another card
            </Button>
            <Form.Text style={{color: "red", marginLeft: "2px"}}>WARNING: the whole card will be removed after update!</Form.Text>
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