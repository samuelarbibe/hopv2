import React from 'react'

import {
  Button, AlertDialog, AlertDialogBody,
  AlertDialogCloseButton, AlertDialogContent, AlertDialogHeader,
  AlertDialogFooter, AlertDialogOverlay, useDisclosure
} from '@chakra-ui/react'

const DeleteButton = ({ title, description, onConfirm, buttonLabel }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const handleConfirm = () => {
    onClose()
    onConfirm()
  }

  return (
    <>
      <Button variant='ghost' colorScheme='red' onClick={onOpen}>{buttonLabel}</Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader dir='rtl'>{title}</AlertDialogHeader>
          <AlertDialogCloseButton left='12px' />
          <AlertDialogBody dir='rtl'>
            {description}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              לא
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleConfirm}>
              כן
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteButton