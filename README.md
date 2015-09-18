# fantasy-arrays

This library implements purely functional, monadic homogenous array 
data structures.

### Seq

Seq is just a wrapper around the native Array structure, but gives you lots of
other functions that should be useful.

```javavscript
var a = Seq.range(0, 12);
a.take(0, 10); // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

### List

List is a linked lists with associated functions.

```javavscript
var a = List.range(0, 12);
a.take(0, 10); // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

### NonEmpty

NonEmpty is a structure that can not be empty.

```javavscript
NonEmpty.of(1); // 1
```

## Fantasy Land Compatible

[
  ![](https://raw.github.com/fantasyland/fantasy-land/master/logo.png)
](https://github.com/fantasyland/fantasy-land)
