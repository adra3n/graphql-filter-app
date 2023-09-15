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
        filteredCountries = filteredCountries.filter(
          (country: { currency: string }) => {
            if (country.currency) {
              return country.currency
                .toUpperCase()
                .includes(groupFilter.toUpperCase())
            }
          }
        )
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

  const handleItemClick = (index: number) => {
    setSelectedItemIndex((prevIndex) => (prevIndex !== index ? index : null))
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
                    onSelect={() => handleItemClick(index)}
                    index={index}
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
