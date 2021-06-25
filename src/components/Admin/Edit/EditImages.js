import React, { useCallback, useRef, useState } from 'react'
import update from 'immutability-helper'
import { useDrag, useDrop } from 'react-dnd'

import {
  HStack, VStack, Image, Button, Input,
  IconButton, Spacer, Text, Center
} from '@chakra-ui/react'
import { CloseIcon, DragHandleIcon } from '@chakra-ui/icons'

const ImageCard = ({ imageUrl, index, moveCard, onDelete }) => {
  const ref = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      moveCard(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { imageUrl, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <HStack ref={ref} opacity={isDragging ? 0.5 : 1} data-handler-id={handlerId} rounded='md' border='1px' borderColor='gray.400' p='3'>
      <DragHandleIcon />
      <Image src={imageUrl} height='100px' />
      <Spacer />
      <IconButton onClick={onDelete} size='sm' variant='ghost' icon={<CloseIcon color='tomato' />} />
    </HStack>
  )
}

const ImagesDnD = ({ imageUrls, onChange }) => {
  const handleMove = useCallback((dragIndex, hoverIndex) => {
    const dragCard = imageUrls[dragIndex]
    onChange(update(imageUrls, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    }))
  }, [imageUrls])

  const handleDelete = (imageToDelete) => {
    onChange(imageUrls.filter((imageUrl) => imageUrl !== imageToDelete))
  }

  const renderCard = (imageUrl, index) => {
    return (<ImageCard key={imageUrl} index={index} imageUrl={imageUrl} moveCard={handleMove} onDelete={() => handleDelete(imageUrl)} />)
  }

  return (
    <VStack alignItems='stretch' w='100%'>
      {
        imageUrls.length
          ? imageUrls.map((imageUrl, index) => renderCard(imageUrl, index))
          : (
            <Center>
              <Text>אין תמונות</Text>
            </Center>
          )
      }
    </VStack>
  )
}

const ImagesEditor = ({ imageUrls, onChange }) => {
  const [tempImage, setTempImage] = useState('')

  const handleAddImage = () => {
    onChange([...imageUrls, tempImage])
    setTempImage('')
  }

  return (
    <VStack flex='1' dir='ltr' spacing='5' width='100%'>
      <ImagesDnD imageUrls={imageUrls} onChange={onChange} />
      <HStack w='100%'>
        <Button disabled={!tempImage.length} onClick={handleAddImage}>הוסף</Button>
        <Input flex='1' type="text" id='newImage' placeholder='Add image URL' value={tempImage} onChange={({ target }) => setTempImage(target.value)} />
      </HStack>
    </VStack>
  )
}

export default ImagesEditor