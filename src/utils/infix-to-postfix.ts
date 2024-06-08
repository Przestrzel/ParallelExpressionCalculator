 //https://www.geeksforgeeks.org/infix-to-postfix-converter-using-javascript/

//Function to return precedence of operators
const prec = (c: string) => {
    if(c === '^')
        return 3;
    else if(c === '/' || c ==='*')
        return 2;
    else if(c === '+' || c === '-')
        return 1;
    else
        return -1;
}

export const infixToPostfix = (s: string) => {

    let st = []; //For stack operations, we are using JavaScript built in stack
    let result = "";

    for(let i = 0; i < s.length; i++) {
        let c = s[i];

        if((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9'))
            result += c;
        else if(c === '(')
            st.push('(');

        // If the scanned character is an ‘)’,
        // pop and to output string from the stack
        // until an ‘(‘ is encountered.
        else if(c === ')') {
            while(st[st.length - 1] !== '(')
            {
                result += st[st.length - 1];
                st.pop();
            }
            st.pop();
        }

        //If an operator is scanned
        else {
            while(st.length !== 0 && prec(s[i]) <= prec(st[st.length - 1])) {
                result += st[st.length - 1];
                st.pop();
            }
            st.push(c);
        }
    }

    // Pop all the remaining elements from the stack
    while(st.length !== 0) {
        result += st[st.length - 1];
        st.pop();
    }
    return result;
}
