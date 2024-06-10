import React from 'react'
import './App.css'
import Tree from './utils/tree'
import TreeVisualization from './components/TreeVisualization'
import { Button, ChakraProvider, Flex, Input } from '@chakra-ui/react'

const example = '(1+2)*(3*((4+5)+6))'

function App() {
  const [input, setInput] = React.useState<string>(example)
  const [savedInput, setSavedInput] = React.useState<string>('')
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
          <Button
            border="2px"
            borderColor={input === savedInput ? 'gray.200' : 'green.500'}
            onClick={() => {
              if(input === savedInput) {
                return;
              }
              setTree(new Tree(input));
              setSavedInput(input);
            }}
          >
            Create Tree
          </Button>
        </Flex>
        <div className="TreeContainer">
          {tree ? <TreeVisualization key={savedInput} tree={tree} setTree={setTree} /> : null}
        </div>
      </div>
    </ChakraProvider>
  )
}

export default App
