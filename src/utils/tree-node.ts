import { NodeDatum, Weight } from './types'


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

  public getId() {
    return this.id;
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

  public setNode(node: TreeNode | undefined) {
    this.id = node?.id || this.id;
    this.value = node?.value || this.value;
    this.left = node?.getLeft();
    this.right = node?.getRight();

    this.left?.setParent(this);
    this.right?.setParent(this);
  }

  public setWeight(weight: Weight) {
    this.weight = weight;
  }

  public static isOperator(value: string): value is '+' | '*' {
    return value === '+' || value === '*';
  }

  public isRightSon(): boolean {
    return this.equals(this.parent?.getRight());
  }

  public isLeftSon(): boolean {
    return this.equals(this.parent?.getLeft());
  }

  public getBrother(): TreeNode | undefined {
    return this.isLeftSon() ? this.parent?.getRight() : this.parent?.getLeft();
  }

  public getWeight(): Weight {
    return this.weight;
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

  public toCalcString(): string {
    return `${this.value} * ${this.weight.a} + ${this.weight.b}`;
  }

  public calculate(): number {
    if(typeof this.value === 'number') {
      return this.value * this.weight.a + this.weight.b;
    }
    return 0
  }

  private add = (a: number, b: number): number => a + b;
  private mul = (a: number, b: number): number => a * b;

  public operator() {
    if(typeof this.value === 'number') {
      return null;
    }
    return this.value === '+' ? this.add : this.mul;
  }

  public equals(node: TreeNode | undefined): boolean {
    if(node === undefined) {
      return false;
    }
    return this.id === node.getId();
  }
}

export default TreeNode;
