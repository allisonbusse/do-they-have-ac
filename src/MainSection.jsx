import React, { useState, useEffect, useRef } from "react"
import AddData from "./AddData"
import ShowACResults from "./ShowACResults"
import ShowPlaceInfo from "./ShowPlaceInfo"

let autoComplete

const MainSection = () => {
  const url = "https://do-they-have-ac-server.herokuapp.com/locations"

  const [query, setQuery] = useState("")
  const [googleResult, setGoogleResult] = useState({})
  const [dbResult, setDbResult] = useState({})
  const [loading, setLoading] = useState(false)
  const autoCompleteRef = useRef(null)

  const handlePlaceSelect = async () => {
    const result = autoComplete.getPlace()
    setQuery(result.name)
    setGoogleResult(result)
  }

  const setUpGoogleAutocomplete = () => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      { types: ["establishment"], componentRestrictions: { country: "us" } }
    )
    autoComplete.setFields([
      "place_id",
      "name",
      "address_components",
      "formatted_address",
    ])
    autoComplete.addListener("place_changed", () => handlePlaceSelect())
  }

  useEffect(() => {
    setUpGoogleAutocomplete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const checkDbForData = async () => {
      setLoading(true)
      fetch(`${url}/${googleResult.place_id}`)
        .then((res) => res.json())
        .then((result) => {
          console.log(result)
          if (result?._id) setDbResult(result)
          setLoading(false)
        })
    }
    if (googleResult.name) {
      checkDbForData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleResult?.name])

  return (
    <div className="d-flex flex-column" style={{ height: "92vh" }}>
      <header className="App-header">
        <h1>Do they have AC?</h1>
      </header>
      <input
        ref={autoCompleteRef}
        onChange={(event) => {
          setGoogleResult({})
          setQuery(event.target.value)
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handlePlaceSelect()
          }
        }}
        placeholder="Where are you going?"
        value={query}
      />
      {googleResult.name && (
        <>
          <div className="flex-grow-1">
            <ShowPlaceInfo googleResult={googleResult} />
            {(dbResult?.no > 0 || dbResult?.yes > 0) && !loading && (
              <ShowACResults dbResult={dbResult} />
            )}
            {!dbResult?._id && !loading && (
              <div className="mt-5">
                We don't have any data for that place yet...
              </div>
            )}
          </div>
          <AddData dbResult={dbResult} googleResult={googleResult} />
        </>
      )}
    </div>
  )
}

export default MainSection
