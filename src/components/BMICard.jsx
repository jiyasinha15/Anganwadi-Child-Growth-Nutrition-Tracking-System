import React from "react";

export default function BMICard({
  bmi,
  height,
  weight
}) {
  return (
    <div className="bmi-card">

      {/* BMI HEADER */}
      <div className="bmi-top">

        <div>
          <span>
            Current BMI
          </span>

          <strong>
            {bmi ?? "--"}
          </strong>
        </div>

        <div className="bmi-symbol">
          BMI
        </div>

      </div>


      {/* HEIGHT & WEIGHT */}
      <div className="bmi-values">

        <div>
          <small>
            Height
          </small>

          <b>
            {height
              ? `${height} cm`
              : "--"}
          </b>
        </div>


        <div>
          <small>
            Weight
          </small>

          <b>
            {weight
              ? `${weight} kg`
              : "--"}
          </b>
        </div>

      </div>


      {/* NOTE */}
      <p>
        For children, BMI should be interpreted
        using age- and sex-specific BMI-for-age
        information.
      </p>

    </div>
  );
}