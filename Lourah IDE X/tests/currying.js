
const add = (a, b) => {
  if (b === undefined) {
    return b => add(a, b);
    }
  return a + b;
  };


function mapper(a) {
  let array = a.slice(0);
  return {map:map => {
      for(let i = 0; i < array.length; i++) {
        array[i] = map(array[i]);
        }
      return {
        mapped:array
        ,original:a
        ,map:map
        }
      }
    }
  }

console.log(JSON.stringify(mapper([100, 101, 102]).map(add(-10))));
