import React, { ChangeEvent, FC, useState } from 'react'
import { TextField } from '@mui/material'

interface CountryFilterProps {
  onFilterChange: (filter: string) => void
}

//i added ChangeEvent<HTMLInputElement for onChange for ts best practice

const CountryFilter: FC<CountryFilterProps> = ({ onFilterChange }) => {
  const [filter, setFilter] = useState('')

  //i added ChangeEvent<HTMLInputElement for onChange for ts best practice

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFilter = event.target.value
    setFilter(newFilter)
    onFilterChange(newFilter)
  }

  return (
    <div>
      <TextField
        type="text"
        placeholder="Filter or search: or group:"
        value={filter}
        onChange={handleFilterChange}
        variant="outlined"
        fullWidth
      />
    </div>
  )
}

export default CountryFilter
