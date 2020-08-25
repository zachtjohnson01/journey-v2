import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Flex, Heading, Text, Link, FormLabel } from "@chakra-ui/core";
import { AnimatePresence, motion } from "framer-motion";

import { GET_LISTINGS } from "../utils";
import ListingMenu from "./listing-menu";
import CompanySelect from "./company-select";

export default function Listings() {
  const { data, loading, error } = useQuery(GET_LISTINGS);
  const [filter, setFilter] = useState("all");

  if (loading) return <div> Loading the universe...</div>;
  if (error) {
    return (
      <>
        <div>Universe broken...</div>
        <p>{error.message}</p>
      </>
    );
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <>
      <Box>
        <FormLabel>Filter:</FormLabel>
        <CompanySelect value={filter} onChange={handleFilterChange}>
          <option value="all">All Companies</option>
        </CompanySelect>
      </Box>
      <AnimatePresence initial={false}>
        {data.listings
          .filter(
            (listing) => filter === "all" || listing.company?.id === filter
          )
          .map((listing) => (
            <motion.div
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.5,
                opacity: 0,
              }}
              initial={{
                scale: 0.5,
                opacity: 0,
              }}
              key={listing.id}
            >
              <Box key={listing.id} p="4">
                <Flex>
                  <ListingMenu listing={listing} />
                  <Box ml="4">
                    <Heading mr="4">
                      <Link href={listing.url}>{listing.title}</Link>
                    </Heading>
                    {listing.description && <Text>{listing.description}</Text>}
                    {listing.company && <Text>{listing.company.name}</Text>}
                  </Box>
                </Flex>
              </Box>
            </motion.div>
          ))}
      </AnimatePresence>
    </>
  );
}
