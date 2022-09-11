import React from "react"

const ShowACResults = ({ googleResult }) => {
  return (
    <div className="mt-4">
      <h3>{googleResult.name}</h3>
      <p>{googleResult.formatted_address}</p>
    </div>
  )
}

export default ShowACResults
