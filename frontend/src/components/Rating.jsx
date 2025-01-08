import PropTypes from "prop-types";

const Rating = ({ value, onChange, readOnly = false }) => {
  const maxStars = 5;
  
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => !readOnly && onChange(i)}
          style={{
            cursor: readOnly ? "default" : "pointer",
            color: i <= value ? "#FFD700" : "#C0C0C0",
            fontSize: "1.5rem",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return <span className="rating">{renderStars()}</span>;
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default Rating;
