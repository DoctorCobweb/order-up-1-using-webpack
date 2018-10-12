# IDEAS

## PARSER FOR DOCKET
it may be better to construct a proper parser...
you have some tokens representing what each line represents, and then
i) pass through the docket data to 'tokenize' it.
ii) construct an abstract syntax tree (AST) using the tokens.

doing it this way may be clearer and also handle random data lines (RC) better.


| PHYSICAL DOCKET                                          |  TOKENIZATION  |
|----------------------------------------------------------|----------------|  
|venue location                                            |  VL            | 
|taken using                                               |  MD            |
|staff mem                                                 |  MD            |
|time                                                      |  MD            |
|[table num]                                               |  MD            |
|[booker name]                                             |  MD            |
|[covers]                                                  |  MD            |
|[PRINT A/C - YADDA @ 19:11]                               |  MD            |
|course name 1                                             |  CN            |
|[extra variable content: 'add gravy' as a menu item]      |  RC            |
|menu item                                                 |  MI            |
|[menu info a]                                             |  II            |
|[menu info b]                                             |  II            |
|[--------]                                                |  IIS           |
|[...]                                                     |                |
|[menu item]                                               |  MI            |
|course name 2                                             |  CN            |
|[extra variable content: 'for band' as a menu item]       |  RC            |
|menu item                                                 |  MI            |
|[menu info]                                               |  II            |
|[--------]                                                |  IIS           |
|[...]                                                     |                | 
|[menu item]                                               |  MI            |
|[...]                                                     |                |
  
## PARSER TOKENS  
VL = Venue Location  
MD = Meta-Data  
CN = Course Name  
MI = Menu Item  
II = Item Info  
IIS = Item Info Separator  
RC = Random Content  
