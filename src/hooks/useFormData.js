import { useState } from "react";

const useFormData = (initialState) => {
    const [formData, setFormData] = useState(initialState);

    const onMutate = (e) => {
        const { id, value, files } = e.target;
        let parsedValue = value;

        // Handle boolean values encoded as strings
        if (value === "true" || value === "false") {
            parsedValue = value === "true";
        }

        // Handle files separately if input type is file
        if (files) {
            setFormData(prevState => ({
                ...prevState,
                [id]: files,
            }));
        } else {
            // Update state for all other input types
            setFormData(prevState => ({
                ...prevState,
                [id]: parsedValue,
            }));
        }
    };

    return [formData, setFormData, onMutate];
};

export default useFormData;

