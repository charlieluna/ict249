<?php
class GameCodes {
	const GLALL = 'all';
	/*
	 * EZ2 Lotto 11AM
	 */
	const EZ2L11 = 'a9a408b2-cdbb-445c-97ab-fb230b300c9c';
	/*
	 * EZ2 Lotto 4PM
	 */
	const EZ2L4 = '7e02042e-d214-4662-fbb5-1545b925803d';
	/*
	 * EZ2 Lotto 9PM
	 */
	const EZ2L9 = 'd401413e-8478-4b6f-7231-74f058373f96';
	/*
	 * 4Digit
	 */
	const D4L  = '6c728ae2-433e-3e42-db76-725daf9cb4a2';
	/*
	 * 6Digit
	 */
	const D6L = '1e5cf248-6c45-1964-d842-1573f19079ee';
	/*
	 * Swertres Lotto 11AM
	 */
	const SWL11 = '3c150003-02b9-ff1e-c5d9-aa637db79213';
	/*
	 * Swertres Lotto 4PM
	 */
	const SWL4 = 'd8cfb8af-cbd3-958d-1321-05b8d33ce538';
	/*
	 * Swertres Lotto 9PM
	 */
	const SWL9 = '1ba6cf50-3508-848d-291c-15cac41fd249';
	/*
	 * Grand Lotto
	 */
	const GRL = 'acf93b61-e41b-29d4-608a-798a4a00c044';
	/*
	 * Lotto 6/42
	 */
	const L642 = 'c53e3aac-3a9a-dea9-4777-3d605f15ddd4';
	/*
	 * Mega Lotto 6/45
	 */
	const ML645 = '4843c5eb-0e65-88f0-595c-c8ad006a4a6f';
	/*
	 * Super Lotto 6/49
	 */
	const SL649 = 'ffd9ec68-a306-5723-ba6b-70cd4a8d31ec';
	
	public static function get_code($code) {
		return constant('self::'.$code);
	}
	
}