import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  useToast,
} from "@chakra-ui/core";

import ListingForm from "./listing-form";
import { GET_LISTINGS, LISTING_FRAGMENT } from "../utils";

const UPDATE_LISTING = gql`
  mutation UpdateListing($input: UpdateListingInput!) {
    updateListing(input: $input) {
      ...ListingFragment
    }
  }
  ${LISTING_FRAGMENT}
`;
const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      ...ListingFragment
    }
  }
  ${LISTING_FRAGMENT}
`;

export default function ListingMenu(props) {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  function closeModal() {
    setModalOpen(false);
  }
  return (
    <>
      <Menu>
        <MenuButton as={IconButton} icon="chevron-down" />
        <MenuList>
          <MenuItem onClick={() => setModalOpen(true)}>Update Listing</MenuItem>
          <DeleteButton id={props.listing.id} />
        </MenuList>
      </Menu>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Listing</ModalHeader>
          <ModalCloseButton />
          <ListingForm
            listing={props.listing}
            buttonText="Save changes"
            mutation={UPDATE_LISTING}
            mutationOptions={{
              onCompleted(data) {
                closeModal();
                toast({
                  title: "Listing updated.",
                  description: `${data.updateListing.title} has been updated`,
                  status: "success",
                });
              },
            }}
          >
            <Button mr="2" onClick={closeModal}>
              Cancel
            </Button>
          </ListingForm>
        </ModalContent>
      </Modal>
    </>
  );
}

function DeleteButton({ id }) {
  const toast = useToast();
  const [deleteListing, { loading }] = useMutation(DELETE_LISTING, {
    variables: { id },
    onCompleted(data) {
      toast({
        title: "Listing deleted",
        description: `${data.deleteListing.title} was deleted`,
        status: "success",
      });
    },
    update: (cache, { data }) => {
      const { listings } = cache.readQuery({ query: GET_LISTINGS });
      cache.writeQuery({
        query: GET_LISTINGS,
        data: {
          listings: listings.filter(
            (listing) => listing.id !== data.deleteListing.id
          ),
        },
      });
    },
  });
  return (
    <MenuItem
      isDisabled={loading}
      onClick={() => {
        if (global.confirm("Are you sure?")) {
          deleteListing();
        }
      }}
    >
      Delete
    </MenuItem>
  );
}
