import React, { useState } from 'react'
import {
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material'

//ts interface for props
interface CountryProps {
  name: string
  native: string
  capital: string
  emoji: string
  currency: string
  languages: { code: string; name: string }[]
  onSelect: (selectedColor: string) => void
  isSelected: boolean
  index: number
}

const backgroundColors = ['orange', 'lightpink', 'lightgreen', 'lightblue']

const Country: React.FC<CountryProps> = ({
  name,
  native,
  capital,
  emoji,
  currency,
  languages,
  onSelect,
  isSelected,
  index,
}) => {
  //setting bg color using % on backgroundColors.lenght here. i was more comfortable with this logic than handling randomness
  const newBackgroundColor = backgroundColors[index % backgroundColors.length]

  const [backgroundColor, setBackgroundColor] =
    useState<string>(newBackgroundColor)
  const [open, setOpen] = useState(false)

  //changed it from random selection to % backgroundColors.length selection
  const handleItemClick = () => {
    onSelect(newBackgroundColor)
    setBackgroundColor(newBackgroundColor)
  }

  //open close functions for dialog box
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      <TableRow
        selected={isSelected}
        onClick={handleItemClick}
        //double click to open info dialog box
        onDoubleClick={handleOpen}
        style={{
          backgroundColor: isSelected ? backgroundColor : 'white',
          cursor: 'pointer',
        }}
      >
        <TableCell>{name}</TableCell>
        <TableCell>{capital}</TableCell>
        <TableCell>{currency}</TableCell>
      </TableRow>
      {/* i ve added a dialog box for country info */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {emoji}-{name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Native Name: {native}</DialogContentText>

          <DialogContentText>Capital: {capital}</DialogContentText>
          <DialogContentText>Currency: {currency}</DialogContentText>
          <hr></hr>
          <DialogContentText>Languages:</DialogContentText>
          {languages.map((language, index) => (
            <DialogContentText key={index}>
              {language.name} ({language.code})
            </DialogContentText>
          ))}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Country
