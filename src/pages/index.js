import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Box, Flex, Heading, Button } from "@chakra-ui/core";
import { Helmet } from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";

import Listings from "../components/listings";
import LoginForm from "../components/login-form";
import CreateListing from "../components/create-listing";

const LOGGED_IN_QUERY = gql`
  {
    isLoggedIn @client
  }
`;

export default function Index() {
  const { data, client } = useQuery(LOGGED_IN_QUERY);
  const { site } = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  const { title } = site.siteMetadata;
  const isLoggedIn = data?.isLoggedIn;

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {isLoggedIn ? (
        <>
          <Flex
            as="header"
            justify="space-between"
            align="center"
            px="4"
            bg="gray.100"
            h="12"
          >
            <Flex align="center">
              <Heading fontSize="lg" mr={4}>
                {title}
              </Heading>
              <CreateListing />
            </Flex>
            <Button
              size="sm"
              onClick={() => {
                localStorage.removeItem("journey:token");
                client.resetStore();
              }}
            >
              Log Out
            </Button>
          </Flex>
          <Box maxW="containers.md" mx="auto">
            <Listings />
          </Box>
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
