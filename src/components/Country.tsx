import React, { useEffect, useState } from 'react'
import {
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from '@mui/material'

//ts interface for props
interface CountryProps {
  name: string
  native: string
  capital: string
  emoji: string
  currency: string
  languages: { code: string; name: string }[]
  onSelect: (selectedColor: string, previousColor: string) => void
  isSelected: boolean
  availableColors: string[]
}

const Country: React.FC<CountryProps> = ({
  name,
  native,
  capital,
  emoji,
  currency,
  languages,
  onSelect,
  isSelected,
  availableColors,
}) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('')
  const [open, setOpen] = useState(false)

  //color change logic
  useEffect(() => {
    if (isSelected) {
      if (backgroundColor === '') {
        const unusedColors = availableColors.filter(
          (color) => color !== backgroundColor
        )
        const randomColorIndex = Math.floor(Math.random() * unusedColors.length)

        const newBackgroundColor = unusedColors[randomColorIndex]
        setBackgroundColor(newBackgroundColor)
      }
    }
  }, [isSelected])

  const handleItemClick = () => {
    if (isSelected) {
      onSelect('', backgroundColor)
    } else {
      const unusedColors = availableColors.filter(
        (color) => color !== backgroundColor
      )
      const randomColorIndex = Math.floor(Math.random() * unusedColors.length)
      const newBackgroundColor = unusedColors[randomColorIndex]
      onSelect(newBackgroundColor, backgroundColor)
      setBackgroundColor(newBackgroundColor)
    }
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
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <DialogContentText>Native Name: {native}</DialogContentText>
          <DialogContentText>Capital: {capital}</DialogContentText>
          <DialogContentText>Currency: {currency}</DialogContentText>
          <DialogContentText>Emoji: {emoji}</DialogContentText>
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
