import { NodeDatum } from "./types";

interface Weight {
  a: number;
  b: number;
}

class TreeNode {
  private id: string;
  private value: number | '+' | '*';
  private weight: Weight;
  private left: TreeNode | undefined;
  private right: TreeNode | undefined;
  private parent: TreeNode | undefined;

  constructor(value: number | '+' | '*', id: string | undefined = undefined) {
    this.value = value;
    this.id = id || value.toString();
    this.left = undefined;
    this.right = undefined;
    this.parent = undefined;
    this.weight = {a: 1, b: 0};
  }

  public getValue() {
    return this.value;
  }

  public getLeft() {
    return this.left;
  }

  public getRight() {
    return this.right;
  }

  public getParent() {
    return this.parent;
  }

  public setLeft(node: TreeNode | undefined) {
    this.left = node;
  }

  public setRight(node: TreeNode | undefined) {
    this.right = node;
  }

  public setParent(node: TreeNode | undefined) {
    this.parent = node;
  }

  public static isOperator(value: string): value is '+' | '*' {
    return value === '+' || value === '*';
  }

  public asNivoNode(): NodeDatum {

    return {
      id: this.id,
      name: this.toString(),
      children: [this.left?.asNivoNode(), this.right?.asNivoNode()].filter((node) => node !== undefined) as NodeDatum[],
    }
  }

  private weightToString(): string {
    return `(${this.weight.a}, ${this.weight.b})`
  }

  public toString(): string {
    if(this.value === '+') {
      return "ADD" + this.weightToString();
    }
    if(this.value === '*') {
      return "MUL" + this.weightToString();
    }
    return this.value.toString() + this.weightToString();
  }
}

export default TreeNode;
