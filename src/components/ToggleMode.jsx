import { Switch, FormControlLabel, FormGroup } from '@mui/material';

export default function ToggleMode({mode, setMode}) {
    const handleChange = (event) => {
        const newMode = event.target.checked ? "hard" : "easy";
        setMode(newMode);
    }

    return (
        <FormGroup>
            <FormControlLabel 
                control={
                    <Switch 
                        checked={mode === "hard"}
                        onChange={handleChange}
                    />
                } 
                label={mode === "easy" ? "Easy" : "Hard"}
            />
        </FormGroup>
    )
}