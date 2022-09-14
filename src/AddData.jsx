import React, { useState } from "react"
import { Modal } from "react-bootstrap"

const AddData = ({ dbResult, googleResult }) => {
  const url = "https://do-they-have-ac-server.herokuapp.com/locations"
  
  const [showThankYou, setShowThankYou] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const addVoteToExistingPlace = (voteType) => {
    if (dbResult?._id) {
      const newData =
        voteType === "no"
          ? { no: dbResult.no + 1, lastUpdated: new Date(Date.now()) }
          : { yes: dbResult.yes + 1, lastUpdated: new Date(Date.now()) }
      fetch(`${url}/${dbResult._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...dbResult, ...newData }),
      })
        .then((res) => res.json())
        .then((result) => setShowThankYou(true))
    }
  }

  const addNewPlace = (voteType) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: googleResult.place_id,
        yes: voteType === "yes" ? 1 : 0,
        no: voteType === "no" ? 1 : 0,
        lastUpdated: Date.now(),
      }),
    })
      .then((res) => res.json())
      .then((result) => setShowThankYou(true))
  }

  return (
    <div className="mt-4">
      <>
        <button className="btn btn-link" onClick={() => setShowModal(true)}>
          Do you know the answer? Tell us!
        </button>

        <Modal
          show={showModal}
          centered
          onHide={() => {
            setShowModal(false)
            setTimeout(() => {
              setShowThankYou(false)
            }, 200)
          }}
        >
          <Modal.Header closeButton>
            <h4 className="mb-0">Does {googleResult.name} have AC?</h4>
          </Modal.Header>
          <Modal.Body className={!showThankYou ? "mb-2" : "mb-4"}>
            {!showThankYou && (
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-secondary"
                  style={{
                    marginRight: "16px",
                  }}
                  onClick={() => {
                    dbResult?._id
                      ? addVoteToExistingPlace("yes")
                      : addNewPlace("yes")
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    dbResult._id
                      ? addVoteToExistingPlace("no")
                      : addNewPlace("no")
                  }}
                >
                  No
                </button>
              </div>
            )}
            {showThankYou && <div>Thanks for helping others stay cool!</div>}
          </Modal.Body>
        </Modal>
      </>
    </div>
  )
}

export default AddData
