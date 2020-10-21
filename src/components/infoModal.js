import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const InformationModal = () => {
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Please Note!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="text-primary header-underline pb-2 mb-3">Outdated Data</h5>
          <p className="mb-4">Data That Gets Requested</p>
          <p>The React Maps Application runs off online based json data, unfortunately, due to unforeseen circumstances, the data does not get updated anymore, and as a result, data wont be available when choosing any date. In order to view information and markings on the map, the user should choose dates between 1 November 2018 & 28 February 2019. 
          <br />
          <br />
          React Maps is still maintained today, and updated data will be available in the future.
          </p>
        </Modal.Body>
        <Modal.Footer className="d-block">
          <p className="mb-3">© 2020 Copyright Uber Technologies, Inc. Data Attributions</p>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InformationModal;