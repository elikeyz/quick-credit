const validateEmailAndPasswordPattern = (req) => {
  // Email regex gotten from http://www.regexlib.com
  // Whitespace regex gotten from https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/regular-expressions/match-whitespace
  // Alphanumeric regex gotten from https://stackoverflow.com/questions/3658145/what-is-the-regex-to-match-an-alphanumeric-6-character-string
  if (!/^.+@[^.].*\.[a-z]{2,}$/.test(req.body.email.trim())) {
    return [400, 'Your email address must follow the pattern ****@**.**'];
  }
  if (/\s/g.test(req.body.password)) {
    return [400, 'You must not add whitespaces in your password'];
  }
  if (!/[a-zA-Z0-9]{6,}/.test(req.body.password)) {
    return [400, 'Your password must contain at least 6 alphanumeric characters'];
  }
  return null;
};

export default validateEmailAndPasswordPattern;
