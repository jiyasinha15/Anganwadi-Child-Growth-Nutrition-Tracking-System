// Demo child data
export const children = [
  {
    id: "1",
    name: "Aarav Kumar",
    dob: "2021-05-12",
    gender: "Male",
    guardian: "Ravi Kumar",
    phone: "9876543210",
    center: "Anganwadi Centre - 01",
    address: "Village Road",

    measurements: [
      {
        date: "2026-06-10",
        height: 96,
        weight: 14.2
      },
      {
        date: "2026-07-10",
        height: 97.5,
        weight: 14.6
      },
      {
        date: "2026-08-10",
        height: 99,
        weight: 15.0
      },
      {
        date: "2026-09-10",
        height: 100,
        weight: 15.3
      }
    ]
  },

  {
    id: "2",
    name: "Ananya Singh",
    dob: "2020-11-08",
    gender: "Female",
    guardian: "Pooja Singh",
    phone: "9876501234",
    center: "Anganwadi Centre - 01",
    address: "Main Market",

    measurements: [
      {
        date: "2026-06-12",
        height: 104,
        weight: 16.8
      },
      {
        date: "2026-07-12",
        height: 105,
        weight: 17.0
      },
      {
        date: "2026-08-12",
        height: 106,
        weight: 17.4
      },
      {
        date: "2026-09-12",
        height: 107,
        weight: 17.8
      }
    ]
  },

  {
    id: "3",
    name: "Vivaan Sharma",
    dob: "2022-01-22",
    gender: "Male",
    guardian: "Neha Sharma",
    phone: "9812345678",
    center: "Anganwadi Centre - 02",
    address: "Station Road",

    measurements: [
      {
        date: "2026-07-05",
        height: 88,
        weight: 12.1
      },
      {
        date: "2026-08-05",
        height: 89,
        weight: 12.2
      },
      {
        date: "2026-09-05",
        height: 90,
        weight: 12.4
      }
    ]
  }
];


// BMI Calculator
// Formula:
// BMI = Weight (kg) / Height (m)^2

export function calculateBMI(weightKg, heightCm) {
  const weight = Number(weightKg);
  const heightInMeter = Number(heightCm) / 100;

  if (
    !weight ||
    !heightInMeter ||
    weight <= 0 ||
    heightInMeter <= 0
  ) {
    return null;
  }

  const bmi = weight / (heightInMeter * heightInMeter);

  return Number(bmi.toFixed(2));
}


// Get latest measurement of a child
export function getLatestMeasurement(child) {
  if (!child || !child.measurements?.length) {
    return null;
  }

  return child.measurements[child.measurements.length - 1];
}


// Calculate latest BMI of a child
export function getLatestBMI(child) {
  const measurement = getLatestMeasurement(child);

  if (!measurement) {
    return null;
  }

  return calculateBMI(
    measurement.weight,
    measurement.height
  );
}