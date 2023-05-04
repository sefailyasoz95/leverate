import Table from "Components/Table";
import { getCountries, getPeople } from "DataApi";
import { Country, GetCounriesResponse } from "DataApi/country.interface";
import { GetPeopleResponse, People } from "DataApi/people.interface";
import React, { useEffect, useState } from "react";

const App: React.FunctionComponent = () => {
	const intervalTiming = 500;
	const [filterValue, setFilterValue] = useState("");
	const [loading, setLoading] = useState(true);
	const [people, setPeople] = useState<GetPeopleResponse>({
		searchResultCount: 0,
		searchResults: [],
		totalResultCounter: 0,
	});
	const [country, setCountry] = useState<GetCounriesResponse>({
		searchResultCount: 0,
		searchResults: [],
		totalResultCounter: 0,
	});
	const handleInitialDataFetching = async () => {
		const response = await getCountries({});
		setCountry(response);
		setLoading(false);
	};
	const handleFiltering = async (value: string) => {
		const response = await getPeople({ search: filterValue });
		const peopleResult = response.searchResults;
		peopleResult.map(
			(item: People) =>
				(item.country = country.searchResults.filter((cnt: Country) => cnt.alpha2Code === item.country)[0].name)
		);
		setPeople({
			searchResultCount: response.searchResultCount,
			totalResultCounter: response.totalResultCounter,
			searchResults: peopleResult,
		});
	};
	useEffect(() => {
		if (!(country.searchResults.length > 0)) {
			handleInitialDataFetching();
		}
		if (filterValue) {
			const interval = setTimeout(() => handleFiltering(filterValue), intervalTiming);
			return () => {
				clearTimeout(interval);
			};
		}
	}, [filterValue]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilterValue(event.target.value);
	};

	return (
		<>
			{loading && (
				<div className='loading'>
					<span>Loading..</span>
				</div>
			)}
			<div className='pageWrapper'>
				<p>Search Component</p>
				<input placeholder='search...' onChange={handleInputChange} value={filterValue} />
				<div className='listWrapper' style={{ height: people.searchResults.length < 1 ? "50px" : "45vh" }}>
					<Table
						rows={people.searchResults}
						columns={[
							{
								column: "first_name",
								displayValue: "First Name",
							},
							{
								column: "last_name",
								displayValue: "Last Name",
							},
							{
								column: "date_of_birth",
								displayValue: "Age",
								dataType: "age",
							},
							{
								column: "country",
								displayValue: "Country",
							},
						]}
					/>
				</div>
				<div className='listWrapper'>
					<Table
						rows={country.searchResults}
						columns={[
							{
								column: "name",
								displayValue: "Name",
							},
							{
								column: "flag",
								displayValue: "Flag",
								dataType: "image",
							},
						]}
					/>
				</div>
				<p>Found results:{people.searchResultCount}</p>
				<p>Total results: {people.totalResultCounter}</p>
			</div>
		</>
	);
};

export default App;
