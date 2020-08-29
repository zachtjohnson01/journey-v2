import React from "react";
import { TagCloseButton } from "@chakra-ui/core";
import { gql, useMutation } from "@apollo/client";
import { GET_LISTINGS } from "../utils";

const REMOVE_CONTACT = gql`
  mutation RemoveContact($input: RemoveContactInput!) {
    removeContact(input: $input) {
      contact {
        id
      }
      listingId
    }
  }
`;

export default function RemoveContactButton(props) {
  const [removeContact, { loading }] = useMutation(REMOVE_CONTACT, {
    variables: {
      input: props.input,
    },
    update(cache, { data }) {
      const { listings } = cache.readQuery({
        query: GET_LISTINGS,
      });
      cache.writeQuery({
        query: GET_LISTINGS,
        data: {
          listings: listings.map((listings) => {
            if (listings.id === data.removeContact.listingId) {
              return {
                ...listings,
                contacts: listings.contacts.filter(
                  (contact) => contact.id !== data.removeContact.contact.id
                ),
              };
            }
            return listings;
          }),
        },
      });
    },
  });
  return <TagCloseButton isDisabled={loading} onClick={removeContact} />;
}
