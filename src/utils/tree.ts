import { infixToPostfix } from "./infix-to-postfix";
import { tokenize } from "./tokenize";
import TreeNode from "./tree-node";
import { Dict } from "./types";


class Tree {
  private expression: string;
  private dictionary: Dict;
  private root: TreeNode | undefined;

  constructor(expression: string) {
    const {dictionary, tokenizedString} = tokenize(expression);
    this.dictionary = dictionary;
    this.expression = infixToPostfix(tokenizedString);
    this.root = undefined;
  }

  public build = () => {
    let stack: TreeNode[] = [];
    let operatorId = 0;

    for(let i = 0; i < this.expression.length; i++) {
      const c = this.expression[i];

      if(c in this.dictionary) {
        const node = new TreeNode(this.dictionary[c], c);
        stack.push(node);
      } else if (TreeNode.isOperator(c)) {
        const node = new TreeNode(c, operatorId.toString());
        const right = stack.pop();
        const left = stack.pop();
        node.setLeft(left);
        node.setRight(right);

        left?.setParent(node);
        right?.setParent(node);

        stack.push(node);
        operatorId++;
      }
    }

    this.root = stack[0];
  }

  public getRoot = () => {
    if(!this.root) {
      this.build();
    }

    return this.root as TreeNode;
  }

  public getLeaves = () => {
    const leaves: TreeNode[] = [];

    const traverse = (node: TreeNode) => {
      if(node.getLeft() === undefined && node.getRight() === undefined) {
        leaves.push(node);
      } else {
        const left = node.getLeft();
        left && traverse(left);
        const right = node.getRight();
        right && traverse(right);
      }
    }

    traverse(this.getRoot());
    return leaves;
  }

  public rake = (node: TreeNode) => {
    // implement rake
  }
}

export default Tree;