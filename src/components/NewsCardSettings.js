import React from 'react';
import { Form, Tabs, Tab, Button } from 'react-bootstrap';

/**
 * return the settings for the news card in profile page
 * @param {Object} props some state objects in parent page
 */
export const NewsCardSettings = (props) => {
  const cardTabs = props.cards.map((card, cardIndex) => {
    return (
      <Tab key={cardIndex} eventKey={cardIndex} title={`Card ${cardIndex+1}`} size="sm">
        <Form.Group 
            key={cardIndex} 
            controlId={cardIndex} 
            style={{backgroundColor: "rgb(219, 215, 210)", padding: "15px"}}
        >
          <Form.Group>
            <Form.Label>Date Bar</Form.Label>
            <Form.Control 
              name="dateBar"
              value={card.dateBar} 
              onChange={props.handleCardChange(cardIndex, "news")}
              disabled={card.deprecated === 1}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Code Segment</Form.Label>
            <Form.Control 
              name="codeSegment"
              as="textarea"
              value={card.codeSegment}
              onChange={props.handleCardChange(cardIndex, "news")}
              disabled={card.deprecated === 1}
              style={{height: "110px"}}
            />
          </Form.Group>

          <Form.Group>
            <Button 
              variant={card.deprecated === 1 ? "outline-danger" : "danger"}
              size="sm"
              onClick={props.handleRemove(cardIndex, "news")}
            >
              {card.deprecated === 1 ? "Cancel" : "Remove"}
            </Button>
            <Button
              size="sm"
              name="news"
              onClick={props.handleAddCard}
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
    <Tabs className="myClass" defaultActiveKey={0}>
      {cardTabs}
    </Tabs>
  );
}