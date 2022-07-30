// playground requires you to assign document definition to a variable called dd

const dd = {
    content: [
        {
            text: 'Mariner Information',
            style: 'header',
        },
        {
            text: [
                { text: 'Mariner ID: ', bold: true },
                { text: marinerInfo['MarinerID'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Application ID: ', bold: true },
                { text: marinerInfo['ApplicationID'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'First Name: ', bold: true },
                { text: marinerInfo['FirstName'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Middle Name: ', bold: true },
                { text: marinerInfo['MiddleName'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Last Name: ', bold: true },
                { text: marinerInfo['LastName'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Address: ', bold: true },
                { text: marinerInfo['StreetAddress'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Phone Number: ', bold: true },
                { text: marinerInfo['PhoneNumber'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Email: ', bold: true },
                { text: marinerInfo['Email'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Height: ', bold: true },
                { text: marinerInfo['Height'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Weight: ', bold: true },
                { text: marinerInfo['Weight'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Hair Color: ', bold: true },
                { text: marinerInfo['HairColor'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Eye Color: ', bold: true },
                { text: marinerInfo['EyeColor'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Distinguishing Marks: ', bold: true },
                { text: marinerInfo['Marks'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'Physical Date: ', bold: true },
                {
                    text:
                        marinerInfo['PhysDate'].toString().slice(0, 15) +
                        '\n\n',
                    bold: false,
                },
            ],
        },
        {
            text: [
                { text: 'Co. Contact: ', bold: true },
                { text: marinerInfo['CoContact'] + '\n\n', bold: false },
            ],
        },
        {
            text: [
                { text: 'IMO Number: ', bold: true },
                { text: marinerInfo['IMONum'] + '\n\n', bold: false },
            ],
        },
        {
            text: 'Employer: ',
            bold: true,
        },
        {
            text: 'Rig: ',
            bold: true,
        },
        {
            text: 'Mariner Reference Number: ',
            bold: true,
        },
        {
            text: 'Passport Number: ',
            bold: true,
        },
        {
            text: 'Citizenship: ',
            bold: true,
        },
        {
            text: 'Birth Country: ',
            bold: true,
        },
        {
            text: 'Birth State: ',
            bold: true,
        },
        {
            text: 'Birth City: ',
            bold: true,
        },
        {
            text: 'Birth Date: ',
            bold: true,
        },
        {
            text: 'Processing Agent: ',
            bold: true,
        },
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
        },
    },
};
