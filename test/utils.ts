import { parse } from 'node-html-parser'

export function toHtmlDocument(content: string): Document {
  const page = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	${content}
</body>
</html>
  `

  // Matching node to browser types is hard!
  return (parse(page) as any) as Document
}