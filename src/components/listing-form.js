import React from "react";
import { useMutation } from "@apollo/client";
import {
  Stack,
  Text,
  Textarea,
  ModalFooter,
  ModalBody,
  Input,
  Button,
} from "@chakra-ui/core";

export default function ListingForm(props) {
  const [mutate, { loading, error }] = useMutation(
    props.mutation,
    props.mutationOptions
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const { title, description, url, notes } = event.target;

    const input = {
      id: props.listing?.id,
      title: title.value,
      description: description.value,
      url: url.value,
      notes: notes.value,
    };

    mutate({
      variables: { input },
    });
  };
  return (
    <form ref={props.formRef} onSubmit={handleSubmit}>
      <ModalBody as={Stack}>
        {error && <Text color="red.500">{error.message}</Text>}
        <Input
          isRequired
          defaultValue={props.listing?.title}
          type="text"
          name="title"
          placeholder="Job Title"
        />
        <Input
          defaultValue={props.listing?.description}
          type="text"
          name="description"
          placeholder="Job Description"
        />
        <Input
          defaultValue={props.listing?.url}
          isRequired
          type="url"
          name="url"
          placeholder="Listing URL"
        />
        <Textarea name="notes" placeholder="Notes" />
      </ModalBody>
      <ModalFooter>
        {props.children}
        <Button variantColor="purple" isLoading={loading} type="submit">
          {props.buttonText}
        </Button>
      </ModalFooter>
    </form>
  );
}
