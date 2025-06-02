import { Avatar, Box, FormControl, FormHelperText, ListItemIcon, ListItemText, MenuItem, Select, useTheme } from "@mui/material";
import CountryCodes from '../internals/data/CountryCodes.json';

interface CountryCodeProps {
    handleInputChange: (field: string, value: string) => void;
    value: string;
    fieldName: string;
    isLabelled?: boolean;
    isHelperText?: boolean;
}

const CountryCode: React.FC<CountryCodeProps> = ({ handleInputChange, value, isLabelled, fieldName, isHelperText }) => {
    const theme = useTheme();
    return (
        <FormControl fullWidth >
            {/* <InputLabel id="alter-country-code-label">Country Code</InputLabel> */}
            <Select
                labelId="alter-country-code-label"
                value={value}
                size="small"
                label={isLabelled ? 'Country Code' : ''}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                renderValue={(selected) => {
                    const country = CountryCodes.find(c => c.dial_code === selected);
                    return country ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                                src={`/src/assets/flags/${country.code.toLowerCase()}.png`}
                                alt={country.code}
                                sx={{ width: 24, height: 24 }}
                                imgProps={{
                                    onError: (e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`;
                                    }
                                }}
                            />
                            <span>{country.dial_code}</span>
                        </Box>
                    ) : selected;
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            '& > fieldset': {
                                borderColor: theme.palette.primary.main,
                            }
                        },
                        '&.Mui-focused': {
                            '& > fieldset': {
                                borderWidth: 2,
                            }
                        }
                    }
                }}
            >
                {CountryCodes.map((country) => (
                    <MenuItem key={country.code} value={country.dial_code}>
                        <ListItemIcon>
                            <Avatar
                                src={`/src/assets/flags/${country.code.toLowerCase()}.png`}
                                alt={country.code}
                                sx={{ width: 24, height: 24 }}
                                imgProps={{
                                    onError: (e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`;
                                    }
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText primary={`${country.name} (${country.dial_code})`} />
                    </MenuItem>
                ))}
            </Select>
            {isHelperText && <FormHelperText>{'Select country code'}</FormHelperText>}
        </FormControl>
    );
};

export default CountryCode;