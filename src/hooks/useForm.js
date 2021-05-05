import { useEffect, useState } from "react";

const createValuesObject = (keys, values) => {
  const result = {};
  keys.forEach((v) => {
    result[v] = values[v] ? values[v] : "";
  });
  return result;
};

const useForm = ({ keys, initial = {} }) => {
  const [values, setValues] = useState(createValuesObject(keys, initial));

  //in case there are initial values
  useEffect(() => {
    updateValues(initial);
  }, [initial]);
  //update
  const updateValues = (data) => {
    setValues((old) => {
      return { ...old, ...data };
    });
  };
  return [values, updateValues];
};

export default useForm;
