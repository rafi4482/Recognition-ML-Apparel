import React from "react";

const Rank = ({ name, entries, title }) => {
  return (
    <div>
      <div className="white f2">
        {`Hello ${name}! Your current entry count is...`}
      </div>
      <div className="white f2">
        {entries}
        <br />
        <br />
        {title && (
          <div>
            Your given image contains a{" "}
            <div
              style={{
                display: "inline",
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "35px",
                color: "black",
              }}
            >
              {title.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rank;
