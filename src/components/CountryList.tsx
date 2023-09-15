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

const CountryList: React.FC = () => {
  const { data } = useQuery(query)
  const [filter, setFilter] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [filteredList, setFilteredList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  //added | null here for select deselect logic
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  )

  const itemsPerPage = 11
  useEffect(() => {
    if (data) {
      //filtering logic for search
      let filteredCountries = data.countries.filter(
        (country: { name: string; capital: string }) => {
          //if its using search:
          if (searchFilter.length > 0) {
            return country.name
              .toUpperCase()
              .includes(searchFilter.toUpperCase())
          } else {
            //else filter with classic search
            return country.name.toUpperCase().includes(filter.toUpperCase())
          }
        }
      )

      if (groupFilter) {
        // grouping logic for 'groupFilter'

        //filtering countries.currency with groupFilter
        filteredCountries = filteredCountries.filter(
          (country: { currency: string }) => {
            if (country.currency) {
              return country.currency
                .toUpperCase()
                .includes(groupFilter.toUpperCase())
            }
            //added for eslint warning
            return false
          }
        )
      }
      //filter logic
      if (data) {
        const filteredCountries = data.countries.filter(
          (country: { code: string; name: string; capital: string }) =>
            country.name.toUpperCase().includes(filter.toUpperCase())
        )
        //useEffect was buggy for selectedIndex so i used here as let
        let selectedIndex = null

        //select 10th country if you can or select last
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
    //when i search for low numbers of results, page i selected was not updating properly. so added this.
    setCurrentPage(1)
  }, [data, filter, searchFilter, groupFilter])

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    //splitting from " " so i can handle group: and search:
    const filterArr = newFilter.split(' ')

    filterArr.forEach((e) => {
      let search = ''
      let group = ''
      //checking for search: and replacing it and trimming it to get searchFilter
      if (e.includes('search:')) {
        search = e.replace('search:', '').trim()
        setSearchFilter(search)
        //same for group: here. getting groupFilter
      } else if (e.includes('group:')) {
        group = e.replace('group:', '').trim()
        setGroupFilter(group)
      }
    })
  }
  //select deselect
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
              //pagination
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
