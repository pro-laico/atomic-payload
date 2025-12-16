const autocompleteOptions = [
  { value: 'on', label: 'Enable Autocomplete' },
  { value: 'off', label: 'Disable Autocomplete' },

  // Personal info
  { value: 'name', label: 'Full Name' },
  { value: 'given-name', label: 'First/Given Name' },
  { value: 'additional-name', label: 'Additional Name' },
  { value: 'family-name', label: 'Family Name' },
  { value: 'nickname', label: 'Nickname' },
  { value: 'username', label: 'Username' },
  { value: 'new-password', label: 'New Password' },
  { value: 'current-password', label: 'Current Password' },
  { value: 'one-time-code', label: 'One-time Code' },

  // Contact info
  { value: 'email', label: 'Email Address' },
  { value: 'tel', label: 'Telephone' },
  { value: 'tel-country-code', label: 'Telephone Country Code' },
  { value: 'tel-national', label: 'Telephone National Number' },
  { value: 'tel-area-code', label: 'Telephone Area Code' },
  { value: 'tel-local', label: 'Telephone Local Number' },
  { value: 'tel-extension', label: 'Telephone Extension' },
  { value: 'impp', label: 'Instant Messaging Protocol' },

  // Address
  { value: 'street-address', label: 'Street Address' },
  { value: 'address-line1', label: 'Address Line 1' },
  { value: 'address-line2', label: 'Address Line 2' },
  { value: 'address-line3', label: 'Address Line 3' },
  { value: 'address-level1', label: 'Region (State/Province)' },
  { value: 'address-level2', label: 'City' },
  { value: 'address-level3', label: 'District / County' },
  { value: 'address-level4', label: 'Neighborhood / Sub-locality' },
  { value: 'country', label: 'Country Code' },
  { value: 'country-name', label: 'Country Name' },
  { value: 'postal-code', label: 'Postal / ZIP Code' },

  // Other
  { value: 'organization', label: 'Organization' },
  { value: 'organization-title', label: 'Job Title' },
  { value: 'url', label: 'URL / Homepage' },
  { value: 'photo', label: 'Photo URL' },
  { value: 'bday', label: 'Birthdate (YYYY-MM-DD)' },
  { value: 'bday-day', label: 'Birth Day' },
  { value: 'bday-month', label: 'Birth Month' },
  { value: 'bday-year', label: 'Birth Year' },
  { value: 'sex', label: 'Gender / Sex' },
]

export default autocompleteOptions
