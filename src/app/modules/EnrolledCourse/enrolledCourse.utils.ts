export const calculateGradeAndPoints = (totalMarks: number) => {
  let result = {
    grade: 'NA',
    gradePoints: 0,
  };
  if (totalMarks >= 0 && totalMarks <= 39) {
    result = {
      grade: 'F',
      gradePoints: 0,
    };
  } else if (totalMarks >= 40 && totalMarks <= 54) {
    result = {
      grade: 'D',
      gradePoints: 2.0,
    };
  } else if (totalMarks >= 55 && totalMarks <= 64) {
    result = {
      grade: 'C',
      gradePoints: 3.0,
    };
  } else if (totalMarks >= 65 && totalMarks <= 79) {
    result = {
      grade: 'B',
      gradePoints: 4.0,
    };
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    result = {
      grade: 'A',
      gradePoints: 5.0,
    };
  }

  return result;
};
