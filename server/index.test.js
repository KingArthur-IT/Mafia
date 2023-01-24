const getRolesCount = require('./game/getRolesCount');

const playersCount = 6

test('Нет отрицательных чисел', (done) => {
	const players = getRolesCount(playersCount, 
		[
            {role: 'lover', count: 1},
            {role: 'reporter', count: 1},
            {role: 'barmen', count: 1},
            {role: 'doctor', count: 1},
            {role: 'bodyguard', count: 1},
            {role: 'terrorist', count: 1}
        ]
	);
	const result = Object.entries(players).some((el) => el[1] < 0)
	
	expect(result).toEqual(false)
	done();
});

test('Количество игроков совпадает с суммой по ролям', (done) => {
	const players = getRolesCount(playersCount, 
		[
            {role: 'lover', count: 1},
            {role: 'reporter', count: 1},
            {role: 'barmen', count: 1},
            {role: 'doctor', count: 1},
            {role: 'bodyguard', count: 1},
            {role: 'terrorist', count: 1}
        ]
	);

	const result = Object.entries(players).reduce((acc, el) => acc += el[1], 0)
	
	expect(result).toEqual(playersCount)
	done();
});

test('Количество игроков по ролям не больше заданного максимума', (done) => {
	const max = [
		{ role: 'lover', count: 1 },
		{ role: 'reporter', count: 1 },
		{ role: 'barmen', count: 1 },
		{ role: 'doctor', count: 1 },
		{ role: 'bodyguard', count: 1 },
		{ role: 'terrorist', count: 1 }
	]

	const players = getRolesCount(playersCount, max);

	const result = max.some((el) => players[el.role] > el.count)
	
	expect(result).toEqual(false)
	done();
});