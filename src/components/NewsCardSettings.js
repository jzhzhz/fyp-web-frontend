import React from 'react';
// eslint-disable-next-line
import { Form, Tabs, Tab, InputGroup, Button } from 'react-bootstrap';

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
              style={{height: "150px"}}
            />
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