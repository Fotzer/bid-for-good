CREATE OR REPLACE FUNCTION check_inserted_bet_value()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW."betValue" <= (SELECT "betValue" FROM "Bet" ORDER BY "betValue" DESC LIMIT 1) THEN
        RAISE EXCEPTION 'Inserted bet value must be bigger than all present values';
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER check_inserted_bet_value_trigger
BEFORE INSERT ON "Bet"
FOR EACH ROW
EXECUTE FUNCTION check_inserted_bet_value();

--DROP TRIGGER check_inserted_bet_value_trigger ON "Bet"