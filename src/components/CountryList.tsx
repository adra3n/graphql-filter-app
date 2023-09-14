import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import Country from './Country'
import CountryFilter from './CountryFilter'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  Pagination,
} from '@mui/material'

//gql query
const query = gql`
  query {
    countries {
      name
      native
      capital
      emoji
      currency
      languages {
        code
        name
      }
    }
  }
`
//bg colors array
const backgroundColors = ['orange', 'lightpink', 'lightgreen', 'lightblue']

const CountryList: React.FC = () => {
  const { data } = useQuery(query)
  const [filter, setFilter] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [filteredList, setFilteredList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  )
  const [availableColors, setAvailableColors] = useState([...backgroundColors])

  const itemsPerPage = 11
  useEffect(() => {
    if (data) {
      let filteredCountries = data.countries.filter(
        (country: { name: string; capital: string }) => {
          if (searchFilter.length > 0) {
            return country.name
              .toUpperCase()
              .includes(searchFilter.toUpperCase())
          } else {
            return country.name.toUpperCase().includes(filter.toUpperCase())
          }
        }
      )

      if (groupFilter) {
        // grouping logic for 'groupFilter'
        const grouped = filteredCountries.reduce(
          (grouped: any, country: any) => {
            const key = country.currency
            if (!grouped[key]) {
              grouped[key] = []
            }
            grouped[key].push(country)
            return grouped
          },
          {}
        )

        // i converted grouped object back into an array here
        filteredCountries = Object.values(grouped).flat()
      }

      if (data) {
        const filteredCountries = data.countries.filter(
          (country: { code: string; name: string; capital: string }) =>
            country.name.toUpperCase().includes(filter.toUpperCase())
        )
        //useEffect was buggy for selectedIndex so i used here as let
        let selectedIndex = null

        if (filteredCountries.length > 0) {
          if (filteredCountries.length >= 10) {
            selectedIndex = 9
          } else {
            selectedIndex = filteredCountries.length - 1
          }
        }
        setSelectedItemIndex(selectedIndex)
      }

      setFilteredList(filteredCountries)
    }

    setCurrentPage(1)
  }, [data, filter, searchFilter, groupFilter])

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)

    const filterArr = newFilter.split(' ')

    filterArr.forEach((e) => {
      let search = ''
      let group = ''
      if (e.includes('search:')) {
        search = e.replace('search:', '').trim()
        setSearchFilter(search)
      } else if (e.includes('group:')) {
        group = e.replace('group:', '').trim()
        setGroupFilter(group)
      }
    })
  }

  const handleItemClick = (
    index: number,
    selectedColor: string,
    previousColor: string
  ) => {
    setSelectedItemIndex((prevIndex) => (prevIndex !== index ? index : null))

    // adding the previous color back to availableColors
    if (previousColor !== '') {
      setAvailableColors((prevColors) => [...prevColors, previousColor])
    }

    // removing the new color from availableColors
    if (selectedColor !== '') {
      setAvailableColors((prevColors) =>
        prevColors.filter((color) => color !== selectedColor)
      )
    }
  }

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0 10px 0' }}>
        Country List
      </Typography>
      <CountryFilter onFilterChange={handleFilterChange} />
      <TableContainer component={Paper} style={{ height: '80vh' }}>
        <Table stickyHeader style={{ height: '70vh' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '50%' }}>
                <b>Name</b>
              </TableCell>
              <TableCell style={{ width: '30%' }}>
                <b>Capital</b>
              </TableCell>
              <TableCell style={{ width: '20%' }}>
                <b>Currency</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map(
                (
                  country: {
                    name: string
                    native: string
                    capital: string
                    emoji: string
                    currency: string
                    languages: { code: string; name: string }[]
                  },
                  index: number
                ) => (
                  <Country
                    key={index}
                    name={country.name}
                    native={country.native}
                    capital={country.capital}
                    emoji={country.emoji}
                    currency={country.currency}
                    languages={country.languages}
                    isSelected={index === selectedItemIndex}
                    onSelect={(selectedColor: string, previousColor: string) =>
                      handleItemClick(index, selectedColor, previousColor)
                    }
                    availableColors={availableColors}
                  />
                )
              )}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(filteredList.length / itemsPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}
        />
      </TableContainer>
      <Typography style={{ margin: '20px 0 10px 0' }}>
        Double Click For More Info!
      </Typography>
    </Container>
  )
}

export default CountryList
