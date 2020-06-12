import React from 'react';
import { Form, Tabs, Tab, Button } from 'react-bootstrap';

const sampleParams = [
  {
    id: 1,
    title: "test1",
    content: "111",
    deprecated: 0
  },
  {
    id: 2,
    title: "test2",
    content: "222",
    deprecated: 0
  },
  {
    id: 3,
    title: "test3",
    content: "333",
    deprecated: 0
  },
];


export const createSettingSection = (props) => {
  const cardTabs = props.cards.map((card, cardIndex) => {
    let formGroups = [];

    for (const [CardKey, keyVal] of Object.entries(card)) {
      const singleFormGroup = 
        <Form.Group>
          <Form.Label>{Cardkey}</Form.Label>
          <Form.Control 
            name={CardKey}
            value={keyVal}
            as={
              (CardKey === "content" || CardKey === "text" || CardKey === "code_segment")
              ? "textarea" : "input"
            } 
            onChange={props.handleCardChange(cardIndex, CardKey)}
            disabled={card.deprecated === 1}
          />
        </Form.Group>
      ;

      formGroups.push(singleFormGroup);
    }

    return (
      <Tab className="card-tab" key={cardIndex} eventKey={cardIndex} title={`Card ${cardIndex+1}`} size="sm">
        <Form.Group 
          key={cardIndex} 
          controlId={cardIndex} 
          style={{backgroundColor: "rgb(219, 215, 210)", padding: "15px"}}
        >
          {formGroups}

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
    <Tabs className="card-tabs" defaultActiveKey={0}>
      {cardTabs}
    </Tabs>
  );
} 