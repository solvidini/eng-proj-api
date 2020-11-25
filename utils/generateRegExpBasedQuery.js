module.exports = (expression) => {
   if (typeof expression === 'undefined' || expression === null) {
      const error = new Error('To find items expression must be set.');
      error.statusCode = 422;
      throw error;
   }
   expression = String(expression);
   //remove forbidden symbols
   expression = expression.replace(/[^*0-9a-zA-Z\-\_ĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+/g, '');
   //remove redundant spaces
   expression = expression.replace(/(\s\s+)/g, ' ');
   expression = expression.replace(/(^\s+)|(\s+$)/g, ' ');
   //remove redundant *
   expression = expression.replace(/(^\*+)/g, '');
   expression = expression.replace(/(\*\*+)/g, '*');

   const expressionArray = expression.split(' ');

   const regExpQueryArray = expressionArray.map((exp) => {
      if (/\*$/gi.test(exp)) {
         exp = exp.replace('*', '');
         return {
            $or: [
               { title: new RegExp(['^', exp, '$'].join(''), 'gi') },
               { company: new RegExp(['^', exp, '$'].join(''), 'gi') },
               { category: new RegExp(exp, 'gi') },
               { description: new RegExp(['^', exp, '$'].join(''), 'gi') },
            ],
         };
      } else {
         if (
            exp.length > 2 &&
            (exp.slice(exp.length - 1, exp.length) === 'a' ||
               exp.slice(exp.length - 1, exp.length) === 'i' ||
               exp.slice(exp.length - 1, exp.length) === 'e' ||
               exp.slice(exp.length - 1, exp.length) === 'y' ||
               exp.slice(exp.length - 1, exp.length) === 'o')
         ) {
            exp = exp.slice(0, -1);
         }
         return {
            $or: [
               { title: new RegExp(exp, 'gi') },
               { company: new RegExp(exp, 'gi') },
               { category: new RegExp(exp, 'gi') },
               { description: new RegExp(exp, 'gi') },
            ],
         };
      }
   });

   return { $and: regExpQueryArray };
};
