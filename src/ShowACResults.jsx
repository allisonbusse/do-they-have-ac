import React from "react"
import ac from "./assets/air-conditioner.png"

const ShowACResults = ({ dbResult }) => {
  const { yes, no, lastUpdated } = dbResult

  if (yes > 0 && no === 0)
    return (
      <>
        <h2 className="mt-5">
          <img style={{ marginRight: "12px" }} alt="ac" src={ac} />
          YES
          <img alt="ac" style={{ marginLeft: "12px" }} src={ac} />
        </h2>
        <div>
          According to {yes} {yes === 1 ? "person" : "people"}
        </div>
        <div>
          Most recent submission:{" "}
          {new Date(lastUpdated).toDateString().slice(4)}
        </div>
      </>
    )

  if (no > 0 && yes === 0)
    return (
      <>
        <h2 className="mt-5">🥵 NO 🥵</h2>
        <div>
          According to {no} {no === 1 ? "person" : "people"}
        </div>
        <div>
          Most recent submission: {new Date(lastUpdated).toDateString()}
        </div>
      </>
    )

  return (
    <>
      <div className="mt-5">Well, we're not totally sure.</div>
      <div>Some people have reported yes, and others said no.</div>
    </>
  )
}

export default ShowACResults
