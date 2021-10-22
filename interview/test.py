a = 'abcd'


def options(str):
    dic = {}
    for i in range(len(str)):
        if i != str[0]:
            dic[str[0]] += str[str[i]]
            dic[str[0]] += str[str[i+1]]

    print(dic)


options(a)
