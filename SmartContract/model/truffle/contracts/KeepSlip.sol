pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;


contract KeepSlip {
    struct Receipt {
        string receiptId;
        string receiptDate;
    }

    mapping(string => Receipt) public receipts;
    string[] public ReceiptIds;

    struct Item {
        string receiptId;
        string productName;
        uint256 price; // thb * 100
        uint256 amount;
        bool warranty;
        uint256 warrantyTime; // day
    }

    Item[] public ItemArray;
    mapping(string => Item[]) public items;

    function recordReceipt(Receipt memory _receipt, Item[] memory _items)
        public
    {
        Receipt memory newReceipt = _receipt;
        receipts[newReceipt.receiptId] = newReceipt;

        for (uint256 i = 0; i < _items.length; i++) {
            Item memory newItem = _items[i];
            items[newReceipt.receiptId].push(newItem);
        }

        ReceiptIds.push(newReceipt.receiptId);
    }

    function getReceipt(string memory _receiptId)
        public
        view
        returns (string memory, string memory)
    {
        Receipt memory currentReceipt = receipts[_receiptId];
        return (currentReceipt.receiptId, currentReceipt.receiptDate);
    }

    function getItem(string memory _receiptId, uint256 _itemNumber)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            uint256,
            bool,
            uint256
        )
    {
        return (
            items[_receiptId][_itemNumber].receiptId,
            items[_receiptId][_itemNumber].productName,
            items[_receiptId][_itemNumber].price,
            items[_receiptId][_itemNumber].amount,
            items[_receiptId][_itemNumber].warranty,
            items[_receiptId][_itemNumber].warrantyTime
        );
    }

    function getAllItem(string memory _receiptId)
        public
        view
        returns (Item[] memory)
    {
        return items[_receiptId];
    }

    function getAllReceipt() public view returns (string[] memory) {
        return ReceiptIds;
    }
}
// test input
// ["a123", "A021684"],[["a123", "Espresso", 4500, 1, false, 0],["a123", "IPhoneXI", 4500000, 1, true, 365]]
// ["AP245", "A021684"],[["AP245", "MacBook Pro", 4599000, 1, true, 365],["AP245", "IPhoneXI", 4500000, 1, true, 365]]
