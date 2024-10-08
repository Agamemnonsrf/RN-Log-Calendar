import { useState } from "react";
import { TextInput } from "react-native";

export const NoteInput2 = () => {
    const [note, setNote] = useState("");
    return (
        <TextInput style={{
            height: "100%",
            width: "100%",
            borderColor: 'gray',
            borderWidth: 1,
            color: "white",
        }} onChangeText={setNote} value={note} multiline
            numberOfLines={8}
            maxLength={2000} />
    )
}