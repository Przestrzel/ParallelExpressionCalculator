import React from 'react'
import './App.css'
import Tree from './utils/tree'
import TreeVisualization from './components/TreeVisualization'
import { Button, ChakraProvider, Flex, Input } from '@chakra-ui/react'

const example = '(2+2)*(4*4)'

function App() {
  const [input, setInput] = React.useState<string>(example)
  const [tree, setTree] = React.useState<Tree | undefined>(undefined)

  return (
    <ChakraProvider>
      <div className="App">
        <Flex justifyContent="center" alignItems="center" gap={4}>
          <Input
            placeholder="Expression like: (2+2)*(4*4)"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            size="lg"
          />
          <Button onClick={() => setTree(new Tree(input))}>Create Tree</Button>
        </Flex>
        <div className="TreeContainer">
          {tree ? <TreeVisualization tree={tree} /> : null}
        </div>
      </div>
    </ChakraProvider>
  )
}

export default App
